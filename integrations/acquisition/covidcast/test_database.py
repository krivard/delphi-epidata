"""Integration tests for covidcast's Database class."""

# standard library
import unittest

# third party
import mysql.connector

# first party
from delphi.epidata.client.delphi_epidata import Epidata
import delphi.operations.secrets as secrets

# py3tester coverage target (equivalent to `import *`)
__test_target__ = 'delphi.epidata.acquisition.covidcast.database'


class DatabaseTests(unittest.TestCase):
  """Tests covidcast database methods."""

  def setUp(self):
    """Perform per-test setup."""

    # connect to the `epidata` database and clear the `covidcast` table
    cnx = mysql.connector.connect(
        user='user',
        password='pass',
        host='delphi_database_epidata',
        database='epidata')
    cur = cnx.cursor()
    cur.execute('truncate table covidcast')
    cnx.commit()
    cur.close()

    # make connection and cursor available to test cases
    self.cnx = cnx
    self.cur = cnx.cursor()

    # use the local instance of the epidata database
    secrets.db.host = 'delphi_database_epidata'
    secrets.db.epi = ('user', 'pass')

    # use the local instance of the Epidata API
    Epidata.BASE_URL = 'http://delphi_web_epidata/epidata/api.php'

  def tearDown(self):
    """Perform per-test teardown."""
    self.cur.close()
    self.cnx.close()

  def test_stdev_across_locations(self):
    """stdev is computed correctly while accounting for most recent issue per key"""

    # insert 2 samples per key with different values
    self.cur.execute('''
      insert into covidcast values
        -- ('src_1', 'sig_1', 'gt_1')
        
        (0, 'src_1', 'sig_1', 'day', 'gt_1', 20200101, 'gv_1',
          0, 0, 0, 0, 0, NULL, 20200101, 0),
        (0, 'src_1', 'sig_1', 'day', 'gt_1', 20200101, 'gv_1',
          0, 18, 0, 0, 0, NULL, 20200102, 1),

        (0, 'src_1', 'sig_1', 'day', 'gt_1', 20200101, 'gv_2',
          0, 0, 0, 0, 0, NULL, 20200101, 0),
        (0, 'src_1', 'sig_1', 'day', 'gt_1', 20200101, 'gv_2',
          0, 12, 0, 0, 0, NULL, 20200102, 1),
          
        (0, 'src_1', 'sig_1', 'day', 'gt_1', 20200101, 'gv_3',
          0, 0, 0, 0, 0, NULL, 20200101, 0),
        (0, 'src_1', 'sig_1', 'day', 'gt_1', 20200101, 'gv_3',
          0, 10, 0, 0, 0, NULL, 20200102, 1),

        (0, 'src_1', 'sig_1', 'day', 'gt_1', 20200102, 'gv_2',
          0, 0, 0, 0, 0, NULL, 20200102, 0),
        (0, 'src_1', 'sig_1', 'day', 'gt_1', 20200102, 'gv_2',
          0, 12, 0, 0, 0, NULL, 20200105, 3),
          
        -- ('src_1', 'sig_1', 'gt_2')
        
        (0, 'src_1', 'sig_1', 'day', 'gt_2', 20200102, 'gv_1',
          0, 0, 0, 0, 0, NULL, 20200102, 0),
        (0, 'src_1', 'sig_1', 'day', 'gt_2', 20200102, 'gv_1',
          0, 37, 0, 0, 0, NULL, 20200105, 3),
          
        (0, 'src_1', 'sig_1', 'day', 'gt_2', 20200101, 'gv_1',
          0, 0, 0, 0, 0, NULL, 20200105, 4),
        (0, 'src_1', 'sig_1', 'day', 'gt_2', 20200101, 'gv_1',
          0, 43, 0, 0, 0, NULL, 20200110, 9),
          
        (0, 'src_1', 'sig_1', 'day', 'gt_2', 20200102, 'gv_2',
          0, 0, 0, 0, 0, NULL, 20200102, 0),
        (0, 'src_1', 'sig_1', 'day', 'gt_2', 20200102, 'gv_2',
          0, 51, 0, 0, 0, NULL, 20200105, 3),
          
        (0, 'src_1', 'sig_1', 'day', 'gt_2', 20200101, 'gv_3',
          0, 0, 0, 0, 0, NULL, 20200105, 4),
        (0, 'src_1', 'sig_1', 'day', 'gt_2', 20200101, 'gv_3',
          0, 21, 0, 0, 0, NULL, 20200110, 9),
          
        -- ('src_1', 'sig_2', 'gt_1')
        
        (0, 'src_1', 'sig_2', 'day', 'gt_1', 20200201, 'gv_1',
          0, 0, 0, 0, 0, NULL, 20200201, 0),
        (0, 'src_1', 'sig_2', 'day', 'gt_1', 20200201, 'gv_1',
          0, 21, 0, 0, 0, NULL, 20200206, 5),
          
        (0, 'src_1', 'sig_2', 'day', 'gt_1', 20200201, 'gv_3',
          0, 0, 0, 0, 0, NULL, 20200201, 0),
        (0, 'src_1', 'sig_2', 'day', 'gt_1', 20200201, 'gv_3',
          0, 2, 0, 0, 0, NULL, 20200206, 5),
          
        (0, 'src_1', 'sig_2', 'day', 'gt_1', 20200210, 'gv_3',
          0, 0, 0, 0, 0, NULL, 20200210, 0),
        (0, 'src_1', 'sig_2', 'day', 'gt_1', 20200210, 'gv_3',
          0, 1000, 0, 0, 0, NULL, 20200211, 1)
    ''')
    self.cnx.commit()

    db = Database()
    db.connect()
    response = db.get_data_stdev_across_locations(20200205)

    # verify stddev match expected value
    self.assertEqual(response, [
      ('src_1', 'sig_1', 'gt_1', 3.0),
      ('src_1', 'sig_1', 'gt_2', 11.0),
      ('src_1', 'sig_2', 'gt_1', 9.5)
    ])
